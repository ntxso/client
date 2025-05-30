import CategoryGrid from "../components/CategoryGrid";

const Home = () => {

  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-bold">Plus Aksesuar</h1>
      </div>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-center py-6">Kategoriler</h1>
        <CategoryGrid />
      </div>
    </div>
  )
}

export default Home
