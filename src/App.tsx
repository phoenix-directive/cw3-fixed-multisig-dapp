import { Routes, Route } from 'react-router-dom'
import Layout from 'components/Layout'
import { SigningCosmWasmProvider } from 'contexts/cosmwasm'
import Home from './pages/Home'
import CreateMultisig from './pages/CreateMultisig'
import MultisigDetail from './pages/MultisigDetail'
import MultisigCreateProposal from './pages/MultisigCreateProposal'
import ProposalDetail from './pages/ProposalDetail'

function App() {
  return (
    <SigningCosmWasmProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateMultisig />} />
          <Route path="/:multisigAddress" element={<MultisigDetail />} />
          <Route
            path="/:multisigAddress/create"
            element={<MultisigCreateProposal />}
          />
          <Route
            path="/:multisigAddress/:proposalId"
            element={<ProposalDetail />}
          />
        </Routes>
      </Layout>
    </SigningCosmWasmProvider>
  )
}

export default App
