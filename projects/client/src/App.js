//import dependencies
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { CheckLogin } from './utils/checklogin';
import axios from 'axios';

//import pages
import Login from './pages/login/login';
import Home from './pages/home/home.jsx';
import Register from './pages/register/register';
import Activation from './pages/activation/activation';
import Admin from './pages/admin/admin';
import AdminLogin from './pages/admin/adminlogin';
import ConfirmEmail from './pages/confirmEmail/confirmEmail';
import ResetPassword from './pages/resetPassword/resetPassword';
import MyAccount from './pages/my-account/myaccount';
import DashboardAccount from './pages/dashboardAccount/dashboardAccount';
import MyAccountInfo from './pages/my-account-info/myAccountInfo';
import MyAccountAddress from './pages/my-account-address/myAccountAddress';
import Cart from './pages/cart/cart';
import ShippingSuccess from './pages/shippingSuccess/shippingSuccess';

//import component
import NavbarUser from './components/navbarUser/navbarUser';
import Footer from './components/homeUser/footer/footer';
import AdminSetting from './components/adminContainer/adminsetting';
import Dashboard from './components/adminContainer/dashboard';
import GetAllAccount from './components/adminContainer/getallaccount';
import Error from './components/error404/error';
import ErrorAdmin from './components/error404/erroradmin';
import Product from './components/product/product';
import ProductDetail from './components/product_detail/product_detail';
import Shipping from './components/shipping/shipping';
import Warehouse from './components/adminContainer/warehouse';
import SalesReport from './components/adminContainer/salesreport';
import Transaction from './components/transaction/transaction';
import TransactionHistory from './components/transactionHistoryUser/transactionHistoryUser';
import DetailTransaction from './components/detailTransactionUser/detailTransactionUser';
import AdminCategoryProducts from './components/adminContainer/adminCategoryProducts';
import AdminProducts from './components/adminContainer/adminProducts';
import AdminProductLocation from './components/adminContainer/adminProductLocation';
import AdminProductListLocation from './components/adminContainer/adminProductListLocation';
import AdminMutation from './components/adminContainer/adminMutation';
import LogProduct from './components/adminContainer/logProduct';
import AdminSuperMutation from './components/adminContainer/adminSuperMutation';


//import context for global
import { userData } from './data/userData'
import { TransactionData } from './data/transactionAdmin'

function App() {
  let [user, setUser] = useState(null)
  let [transaction, setTransaction] = useState(null)
  let navigate = useNavigate()
  let location = useLocation()

  const [show, setShow] = useState([])
  const [nyow, setNyow] = useState([])
  const [adaSort, setAdaSort] = useState([])
  const [showDetail, setShowDetail] = useState([])
  const [detail, setDetail] = useState([])
  const [detailProduct, setDetailProduct] = useState([])
  const [verifyStatus, setVerifyStatus] = useState('')
  const [itemCart, setItemCart] = useState([])
  const [arrColor, setArrColor] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [detailQty, setDetailQty] = useState(0)
  const [showPage, setShowPage] = useState(1)
  const [showPages, setShowPages] = useState(1)
  const [cek, setCek] = useState(undefined)
  const [initialPrice, setInitialPrice] = useState(0)
  const [loadingPage, setLoadingPage] = useState(false)

  const [loadingIndex, setLoadingIndex] = useState(0)

  const [conditionPage, setConditionPage] = useState(false)
  const [chance, setChance] = useState(false)
  const [selected, setSelected] = useState(0)
  const [memory, setMemory] = useState([])

  let userValue = useMemo(() => ({ user, setUser }), [user, setUser])
  let transactionDetail = useMemo(() => ({ transaction, setTransaction }), [transaction, setTransaction])

  let sumQty = async()=>{
    try {
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/get-count/a`)
    } catch (error) {
        
    }
  }

  let keepLogin = async () => {
    let response = await CheckLogin()
    if (response.id==null) {
      localStorage.removeItem('token')
      setUser(response)
    } else {
      setUser(response)
    }

  }

  let getProductDetail = async (id) => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/productdetail/${id}`)
      setDetail(response.data.data[0])
      setDetailProduct(response.data.data[0].product_details)
      setDetailQty(response.data.data2);
      setInitialPrice(response.data.data[0].product_details[0].price)
      setLoadingPage(false)
    } catch (error) {
    }
    finally{
      // sumQty()
    }
  }

  let getColor = async (id) => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/color/${id}`)
      setAdaSort(response.data.data);
    } catch (error) {

    }
    finally{
      // sumQty()
    }
  }

  let getProduct = async (id, ada, _page, btn) => {
    // console.log(ada);
    setCek(ada);
    try {
        if(ada==undefined){
          if(btn==="next"){
            _page=Number(_page)+1
        }else if(btn==="prev"){
            _page=Number(_page)-1
        }
        // console.log(true);
        let {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id}?page=${_page?_page:showPages}`)
        setShowPage({page: data.page, pages: data.pages, total: data.total})
        setShow(data.data)
        setNyow();
        var arrColor = []
        var arrColor2 = []
        data.data.forEach((item, index) => {
          item.product_details.forEach((item, index) => {
            if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          })
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
        // getColor()
    }else if(ada === "az"){
    //   console.log("ADA AZ");
    //   if(btn==="next"){
    //     _page=Number(_page)+1
    // }else if(btn==="prev"){
    //     _page=Number(_page)-1
    // }
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/sort-name/${id}?sort=${ada}`)
        // setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
        setShow(response.data.data);
        setNyow();
        var arrColor = []
        var arrColor2 = []
        response.data.data.forEach((item, index) => {
          item.product_details.forEach((item, index) => {
            if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          })
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
    }else if(ada === "za"){
    //   console.log("ADA ZA");
    //   if(btn==="next"){
    //     _page=Number(_page)+1
    // }else if(btn==="prev"){
    //     _page=Number(_page)-1
    // }
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/sort-name/${id}?sort=${ada}`)
        // setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
        setShow(response.data.data);
        setNyow();
        var arrColor = []
        var arrColor2 = []
        response.data.data.forEach((item, index) => {
          item.product_details.forEach((item, index) => {
            if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          })
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
    }else if(ada === "lohi"){
    //   if(btn==="next"){
    //     _page=Number(_page)+1
    // }else if(btn==="prev"){
    //     _page=Number(_page)-1
    // }
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/sort-name/${id}?sort=${ada}`)
      // setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
      setShow(response.data.data);
      setNyow(response.data.data);
      var arrColor = []
        var arrColor2 = []
        response.data.data.forEach((item, index) => {
          if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
    }else if(ada === "hilo"){
    //   if(btn==="next"){
    //     _page=Number(_page)+1
    // }else if(btn==="prev"){
    //     _page=Number(_page)-1
    // }
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/sort-name/${id}?sort=${ada}`)
      // setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
      setShow(response.data.data);
      setNyow(response.data.data);
      var arrColor = []
        var arrColor2 = []
        response.data.data.forEach((item, index) => {
          if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
    }else{
    //   if(btn==="next"){
    //     _page=Number(_page)+1
    // }else if(btn==="prev"){
    //     _page=Number(_page)-1
    // }
      let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/sort-product/${id}`,{color: ada})
      // setShowPage({page: response.data.page, pages: response.data.pages, total: response.data.total})
      setShow(response.data.data);
      setNyow(response.data.data);
      var arrColor = []
        var arrColor2 = []
        response.data.data.forEach((item, index) => {
          if (!arrColor.includes(item.colorhex)) arrColor.push(item.colorhex)
          arrColor2.push(arrColor)
          arrColor = []
        });
        setArrColor(arrColor2);
      }

    } catch (error) {
    }
    finally{
      // sumQty()
    }
  }
  // let loginKeep = async () => {
  //   try {
  //     let response = await axios.post('${process.env.REACT_APP_API_BASE_URL}/users/keep-login', {
  //       headers: {
  //         "token": localStorage.getItem('token')
  //       }
  //     })
  //     setVerifyStatus(response.data.data.status);
  //   } catch (error) {

  //   }
  // }
  let notRegister = async() => {
    try {
      if ((localStorage.getItem("token") == null)) {
        setTimeout(() => {
          toast.error('Login or regist first', {
            duration: 3000
          })
        }, 1000)

        setTimeout(() => {
          navigate('/')
        }, 3000)
      }

      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/status-user`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      

      if (response.data.data.status==="Unverified") {
        setTimeout(() => {
          toast.error('Please verify account first', {
            duration: 3000
          })
        }, 1000)

        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
      
    } catch (error) {

    }
  }

  let getCart = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cart/data-cart`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      setItemCart(response.data.data)

      let sum = 0
      response.data.data.forEach(e =>
        sum += e.qty * e.product_detail.price)
      setTotalPrice(sum)
      setLoading(false)

    } catch (error) {
    }
  }

  useEffect(() => {
    keepLogin()
    // loginKeep()
  }, [])

  return (
    <userData.Provider value={userValue}>
      {
        location.pathname.split('/')[1] == "admin" ?
          <>
            <TransactionData.Provider value={transactionDetail}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/admin' element={<Admin />} >
                  <Route path='' element={<Dashboard />} />
                  <Route path='all-user' element={<GetAllAccount />} />
                  <Route path='setting' element={<AdminSetting />} />
                  <Route path='Transaction' element={<Transaction />} />
                  <Route path='log-product' element={<LogProduct />} />
                  <Route path='warehouse' element={<Warehouse />} />
                  <Route path='products' element={<AdminCategoryProducts />} >
                    <Route path=':id' element={<AdminProducts func={{sumQty}} />} />
                  </Route>
                  <Route path='products-location' element={<AdminProductLocation />} >
                    <Route path=':id' element={<AdminProductListLocation />} />
                  </Route>
                  <Route path='mutation' element={<AdminMutation />} />
                  <Route path='mutation-super' element={<AdminSuperMutation />} />
                  <Route path='sales-report' element={<SalesReport />} />
                  <Route path='*' element={<ErrorAdmin />} />

                </Route>
              </Routes>
            </TransactionData.Provider>
          </>
          :
          <>
            <NavbarUser func={{ getProductDetail, getProduct, notRegister, getCart, getColor }} data={{ show, itemCart, adaSort, setInitialPrice, setLoadingPage,setSelected,setMemory, showPage }} />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login data={{ setConditionPage, conditionPage }} />} />
              <Route path='/register' element={<Register data={{setConditionPage}}/>} />
              <Route path='/activation/:id' element={<Activation data={{ setConditionPage }} />} />
              <Route path='/confirm-email' element={<ConfirmEmail data={{ setChance, chance,setConditionPage }} />} />
              <Route path='/reset-password/:id' element={<ResetPassword data={{ setConditionPage, setChance }} />} />
              <Route path='/my-account' element={<MyAccount data={{ itemCart, setItemCart }} />}>
                <Route path='' element={<DashboardAccount />} />
                <Route path='information' element={<MyAccountInfo />} />
                <Route path='address' element={<MyAccountAddress />} />
                <Route path='history' element={<TransactionHistory />} />
                <Route path='history-detail' element={<DetailTransaction />} />
              </Route>
              <Route path='/cart' element={<Cart func={{ getCart }} data={{ itemCart, setItemCart, totalPrice, loading, setLoading, setLoadingIndex, loadingIndex }} />} />
              <Route path='/login-admin' element={<AdminLogin />} />
              <Route path='*' element={<Error data={{setConditionPage}}/>} />
              <Route path='/product/:id' element={<Product data={{ arrColor, show, detail, detailProduct, nyow, adaSort, loadingPage, showPage, cek  }} func={{ getProduct, getColor }} />} />
              <Route path='/product/productdetail/:id' element={<ProductDetail func={{ setShowDetail, getProductDetail, getCart }} data={{ showDetail, show, detail, detailProduct, itemCart, detailQty, verifyStatus, initialPrice, loadingPage, setSelected, selected,memory,setMemory }} />} />
              <Route path='/shipping' element={<Shipping func={{ setShowDetail, getProductDetail, notRegister, setItemCart }} />} />
              <Route path='/shipping/success' element={<ShippingSuccess func={{ getCart }} />} />
            </Routes>
            <Toaster />
            <Footer />
          </>
      }
    </userData.Provider>
  );
}

export default App;