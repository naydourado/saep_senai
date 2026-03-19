import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' 
import Login from './pages/login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        
        {/* <Route path='/register/' element={< Register/>}/>

        <Route 
          path='/user/home' 
          element={
            <PrivateRoute>
                <HomeUser/>
              </PrivateRoute>
            }
          /> 
          
          <Route 
            path='/admin/home' 
            element={
              <AdminRoute>
                <HomeAdmin/>
              </AdminRoute>
            }/>
            <Route 
            path='/users' 
            element={
              <AdminRoute>
                <UsersAdmin/>
              </AdminRoute>
            }/>
            <Route 
            path='/properties' 
            element={
              <AdminRoute>
                <Properties/>
              </AdminRoute>
            }/>
            <Route 
            path='/payments' 
            element={
              <AdminRoute>
                <Payments/>
              </AdminRoute>
            }/>
            <Route 
            path='/contracts' 
            element={
              <AdminRoute>
                <Contracts/>
              </AdminRoute>
            }/> */}
      </Routes>
    </Router>
  )
}

export default App