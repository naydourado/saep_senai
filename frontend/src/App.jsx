import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' 
import Login from './pages/login'
import Home from './pages/home'
import CadastroProduto from './pages/cadastroProduto'
import NovoProduto from "./pages/novoProduto"
import GestaoEstoque from './pages/gestaoEstoque'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/cadastro-produto' element={<CadastroProduto/>}/>
        <Route path="/novo-produto" element={<NovoProduto />} />
        <Route path='/gestao-estoque' element={<GestaoEstoque/>}/>        
      </Routes>
    </Router>
  )
}

export default App