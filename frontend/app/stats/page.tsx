import Dashboard from '@/components/dashboard';

const StatsPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1>
        Traffic Statistics
      </h1>
        <Dashboard />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          This is where your traffic statistics and data visualizations will go.
          You can add charts, tables, and other data-driven components here.
        </p>
      </div>
    </div>
  );
};

export default StatsPage;
