import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor

df = pd.read_csv(r"C:\Users\yashg\Desktop\SIH25\files\mumbai_traffic_dataset.csv")

features = [
    'north_count', 'south_count', 'east_count', 'west_count',
    'north_queue', 'south_queue', 'east_queue', 'west_queue',
    'total_queue_length', 'traffic_density', 'congestion_ratio',
    'peak_direction_ratio', 'total_demand', 'avg_vehicles_per_direction'
]

X = df[features]

y = df[['optimal_ns_green', 'optimal_ew_green']]

X_train, X_test, y_train, y_test = train_test_split( X, y, test_size=0.2, random_state=42)

xgb = XGBRegressor(objective='reg:squarederror', random_state=42)

xgb_params = {
    'n_estimators': [200, 400, 600],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.7, 0.9, 1],
    'colsample_bytree': [0.7, 0.9, 1]
}

xgb_search = RandomizedSearchCV( estimator=xgb, param_distributions=xgb_params, n_iter=20, scoring='r2', cv=3, verbose=1, n_jobs=-1, random_state=42)
xgb_search.fit(X_train, y_train)

best_xgb = xgb_search.best_estimator_
y_pred_xgb = best_xgb.predict(X_test)

mse_xgb = mean_squared_error(y_test, y_pred_xgb)
r2_xgb = r2_score(y_test, y_pred_xgb)

print("XGBoost Best Params:", xgb_search.best_params_)
print(f"XGBoost -> MSE: {mse_xgb:.2f}, R²: {r2_xgb:.2f}")

