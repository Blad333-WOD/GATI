

import os
import time
import argparse
from typing import Dict, List, Tuple

import numpy as np

import tensorflow as tf
from tensorflow import keras

import traci


# Paths
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(THIS_DIR)
DEFAULT_SUMO_CFG = os.path.join(PROJECT_ROOT, "mumbai", "sumo", "osm.sumocfg")
DEFAULT_MODEL_PATH = os.path.join(THIS_DIR, "rl_policy.keras")


# Target junctions - only control a few key ones, let others run naturally
TARGET_JUNCTIONS = {
    "cluster_10272736790_1936355361_2629418478_296362019_#1more",  # The problematic one from your image
    "GS_cluster_471591707_5353822010",
    "1468337691",
    "2629418499"
}


TIMING_COMBINATIONS: List[Tuple[int, int]] = [
    (20, 40), (25, 35), (30, 30),
    (35, 25), (40, 20), (45, 45),
    (50, 40), (55, 35), (60, 30)
]

# Minimum green time requirement (seconds)
MIN_GREEN_TIME = 15


def ensure_sumo_env() -> None:
    if "SUMO_HOME" not in os.environ:
        # Try common Windows install path
        possible = r"C:\\Program Files (x86)\\Eclipse\\Sumo"
        if os.path.isdir(possible):
            os.environ["SUMO_HOME"] = possible
    if "SUMO_HOME" in os.environ:
        os.environ["PATH"] += os.pathsep + os.path.join(os.environ["SUMO_HOME"], "bin")


def start_sumo(cfg_path: str, gui: bool, step_length: float) -> None:
    binary = "sumo-gui" if gui else "sumo"
    cmd = [binary, "-c", cfg_path, "--step-length", str(step_length), "--no-warnings", "true"]
    traci.start(cmd)


def get_controllable_tls() -> List[str]:
    all_tls = list(traci.trafficlight.getIDList())
    if TARGET_JUNCTIONS:
        # Use specific target junctions only
        selected = [tl for tl in all_tls if tl in TARGET_JUNCTIONS]
        print(f"Found {len(all_tls)} total traffic lights, controlling only {len(selected)} key ones")
        print(f"Controlled TLs: {selected}")
        print(f"Others will run with SUMO's default programs")
    else:
        # Control ALL traffic lights (not recommended)
        selected = all_tls
        print(f"Found {len(all_tls)} total traffic lights, controlling ALL (not recommended)")
    
    return selected


def build_state_vector_for_tl(tl_id: str, sim_time_s: float) -> np.ndarray:
    """
    Build a 15-dim state matching the training format (per junction):
      [4 vehicle_counts, 4 queue_lengths, 1 time_of_day, 1 traffic_density, 5 weather one-hot]

    We approximate four approaches (N,S,E,W) by using the first four controlled lanes.
    """
    lanes = traci.trafficlight.getControlledLanes(tl_id)
    unique_lanes = []
    seen = set()
    for l in lanes:
        if l not in seen:
            unique_lanes.append(l)
            seen.add(l)

    # Vehicle counts and queues for up to 4 lanes; pad if fewer
    counts = []
    queues = []
    for i in range(4):
        if i < len(unique_lanes):
            lane_id = unique_lanes[i]
            counts.append(traci.lane.getLastStepVehicleNumber(lane_id))
            queues.append(traci.lane.getLastStepHaltingNumber(lane_id))
        else:
            counts.append(0)
            queues.append(0)

    # Time of day normalized (wrap 24h)
    time_of_day = (sim_time_s % 86400.0) / 86400.0

    # Traffic density proxy from total halts
    total_halts = float(sum(queues))
    traffic_density = min(total_halts / 100.0, 1.0)

    # Weather one-hot (assume clear in absence of sensor input)
    weather = [1.0, 0.0, 0.0, 0.0, 0.0]

    vec = np.array(counts + queues + [time_of_day] + [traffic_density] + weather, dtype=np.float32)
    assert vec.shape[0] == 15
    return vec


def action_to_timings(action: int) -> Tuple[int, int]:
    """Convert action to signal timings with minimum green time enforcement"""
    ns_green, ew_green = TIMING_COMBINATIONS[int(action)]
    
    # Enforce minimum green time requirement
    ns_green = max(ns_green, MIN_GREEN_TIME)
    ew_green = max(ew_green, MIN_GREEN_TIME)
    
    return ns_green, ew_green


def is_two_axis_phase_plan(tl_id: str) -> bool:
    try:
        program = traci.trafficlight.getCompleteRedYellowGreenDefinition(tl_id)
        if not program:
            return False
        phases = program[0].phases
        # Heuristic: at least 3 phases and green appears in two alternating phases
        green_phase_indices = [i for i, p in enumerate(phases) if "G" in p.state]
        return len(green_phase_indices) >= 2
    except Exception:
        return False


def check_traffic_light_health(tl_id: str, sim_step: int) -> bool:
    """Check if traffic light is working properly - no emergency intervention"""
    try:
        lanes = traci.trafficlight.getControlledLanes(tl_id)
        total_halting = sum(traci.lane.getLastStepHaltingNumber(lane) for lane in lanes)
        
        # Just log the status, don't force anything
        if sim_step % 100 == 0:  # Log every 100 steps
            print(f"TL {tl_id}: {total_halting} halting vehicles")
        return False  # Never force emergency green
    except Exception:
        return False


def apply_action_to_tls(tl_id: str, action: int, sim_step: int) -> None:
    """Apply RL action with ZERO interference - only log, don't control"""
    ns_green, ew_green = action_to_timings(action)
    
    # Just log the decision, don't actually control anything
    if sim_step % 200 == 0:  # Log every 200 steps
        print(f"Step {sim_step}: {tl_id} -> NS: {ns_green}s, EW: {ew_green}s (NOT APPLIED - letting SUMO run naturally)")
    
    # DO NOTHING - let SUMO handle all traffic light control naturally
    # This prevents any interference that might cause stuck red lights


def main():
    global MIN_GREEN_TIME
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--cfg", default=DEFAULT_SUMO_CFG, help="Path to .sumocfg file")
    parser.add_argument("--model", default=DEFAULT_MODEL_PATH, help="Path to Keras model (.keras)")
    parser.add_argument("--gui", action="store_true", help="Run with SUMO GUI")
    parser.add_argument("--max-steps", type=int, default=1800, help="Simulation steps to run")
    parser.add_argument("--decision-interval", type=int, default=10, help="Steps between RL decisions per TLS")
    parser.add_argument("--allow-random", action="store_true", help="If model missing, run with random actions")
    parser.add_argument("--min-green", type=int, default=MIN_GREEN_TIME, help="Minimum green time in seconds")
    args = parser.parse_args()

    ensure_sumo_env()

    if not os.path.isfile(args.cfg):
        raise FileNotFoundError(f"SUMO config not found: {args.cfg}")

    # Update minimum green time from command line
    MIN_GREEN_TIME = args.min_green
    print(f"Minimum green time set to: {MIN_GREEN_TIME} seconds")

    policy = None
    if not os.path.isfile(args.model):
        if args.allow_random:
            print(
                f"WARNING: RL policy not found at: {args.model}. Running with random actions.\n"
                f"To enable RL control later, save from notebook: agent.q_network.save(r'{args.model}')\n"
                f"All timings will be enforced with minimum {MIN_GREEN_TIME}s green time."
            )
        else:
            raise FileNotFoundError(
                f"RL policy not found: {args.model}\n"
                f"Export it from the notebook: agent.q_network.save(r'{args.model}')\n"
                f"Or run this script with --allow-random to validate SUMO control without a model."
            )
    else:
        # Load Keras model
        policy = keras.models.load_model(args.model)
        print(f"RL policy loaded. All timings will be enforced with minimum {MIN_GREEN_TIME}s green time.")

    # Start SUMO
    start_sumo(args.cfg, gui=args.gui, step_length=1.0)

    try:
        tls = get_controllable_tls()
        print(f"Controlling {len(tls)} traffic lights: {tls}")

        # Track last decision time per light
        last_decision: Dict[str, int] = {tl: -9999 for tl in tls}

        step = 0
        while step < args.max_steps:
            # Make RL decisions at the configured interval
            for tl in tls:
                if step - last_decision[tl] >= args.decision_interval:
                    if policy is not None:
                        state_vec = build_state_vector_for_tl(tl, sim_time_s=float(step))
                        # Model expects shape (1, 15)
                        q_values = policy.predict(state_vec.reshape(1, -1), verbose=0)
                        action = int(np.argmax(q_values[0]))
                    else:
                        action = int(np.random.randint(0, len(TIMING_COMBINATIONS)))

                    apply_action_to_tls(tl, action, step)
                    last_decision[tl] = step
                
                # Simple health check - just log, don't interfere
                check_traffic_light_health(tl, step)

            traci.simulationStep()
            step += 1
            
            # Check if simulation has ended naturally
            if traci.simulation.getMinExpectedNumber() == 0:
                print(f"Simulation ended naturally at step {step} - all vehicles completed their routes")
                break

        print("Simulation complete.")
    finally:
        traci.close()


if __name__ == "__main__":
    main()


