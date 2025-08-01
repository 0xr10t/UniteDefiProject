import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Resolver() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f051d] to-[#1a0b30] text-white font-sans">
      <Navbar />
      <main className="flex-grow px-6 sm:px-10 md:px-16 lg:px-32 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Resolver</h1>

        <div className="bg-[#15032a] rounded-xl p-6 border border-[#32214b]">
          <h2 className="text-2xl font-semibold text-center mb-6">Available Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="text-[#aaa] border-b border-[#32214b]">
                <tr>
                  <th className="py-3 px-4">From :</th>
                  <th className="py-3 px-4">To :</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Min Return</th>
                  <th className="py-3 px-4">Profit Est</th>
                  <th className="py-3 px-4">Fill</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-[#32214b] hover:bg-[#1e0b3d] transition">
                  <td className="py-3 px-4">ETH</td>
                  <td className="py-3 px-4">USDC</td>
                  <td className="py-3 px-4">1.5</td>
                  <td className="py-3 px-4">2000</td>
                  <td className="py-3 px-4 text-green-400">+ $38</td>
                  <td className="py-3 px-4 text-indigo-400 cursor-pointer">[Fill]</td>
                </tr>
                <tr className="hover:bg-[#1e0b3d] transition">
                  <td className="py-3 px-4">ETH</td>
                  <td className="py-3 px-4">DAI</td>
                  <td className="py-3 px-4">1.2</td>
                  <td className="py-3 px-4">2200</td>
                  <td className="py-3 px-4 text-green-400">+ $19</td>
                  <td className="py-3 px-4 text-indigo-400 cursor-pointer">[Fill]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-[#15032a] border border-[#32214b] rounded-lg px-6 py-4 text-center text-white">
          <span className="font-medium text-sm">AI BOX :</span>
          <span className="ml-2 text-sm">Base or Mantle Recommended — Avg Return: <span className="text-indigo-300 font-semibold">3060 USDC</span></span>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Resolver ;
