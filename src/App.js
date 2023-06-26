import React from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header/Header'
import Drawer from './components/Drawer/Drawer'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Orders from './pages/Orders'
import AppContext from './context'

function App() {

  const [items, setItems] = React.useState([])
  const [cartItems, setCartItems] = React.useState([])
  const [favorites, setFavorites] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [cardOpened, setCardOpened] = React.useState(false)
  const [isLoading, setisLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        setisLoading(true)
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://6492cc45428c3d2035d0b48c.mockapi.io/cart'),
          axios.get('https://649303e2428c3d2035d1234a.mockapi.io/favorites'),
          axios.get('https://6492cc45428c3d2035d0b48c.mockapi.io/items'),
        ])
        setisLoading(false)

        setCartItems(cartResponse.data)
        setFavorites(favoritesResponse.data)
        setItems(itemsResponse.data)
      } catch {
        alert('Ошибка при запросе данных ;(')
      }
    }
    fetchData()
  }, [])

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.parentId))
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.parentId)))
        await axios.delete(`https://6492cc45428c3d2035d0b48c.mockapi.io/cart/${Number(findItem.id)}`)
      } else {
        const { data } = await axios.post('https://6492cc45428c3d2035d0b48c.mockapi.io/cart', obj)
        setCartItems(prev => [...prev, data])
      }
    } catch {
      alert('Ошибка при добавлении в корзину')
    }
  }

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://6492cc45428c3d2035d0b48c.mockapi.io/cart/${id}`)
      setCartItems((prev) => prev.filter(item => Number(item.id) !== Number(id)))
    } catch {
      alert('Ошибка при удалении из корзины')
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const onAddToFavorite = async (obj) => {
    try {
      console.log(favorites)
      const findItem = favorites.find(favObj => Number(favObj.parentId) === Number(obj.parentId))
      if (findItem) {
        setFavorites((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.parentId)))
        await axios.delete(`https://649303e2428c3d2035d1234a.mockapi.io/favorites/${findItem.id}`)
      } else {
        const { data } = await axios.post('https://649303e2428c3d2035d1234a.mockapi.io/favorites', obj)
        setFavorites(prev => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id))
  }

  const isItemAddedToFavorite = (id) => {
    return favorites.some((obj) => Number(obj.parentId) === Number(id))
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, setCardOpened, setCartItems, onAddToCart, isItemAddedToFavorite }}>
      <div className="wrapper clear">
        <Drawer items={cartItems} onClose={() => setCardOpened(false)} onRemove={onRemoveItem} opened={cardOpened} />
        <Header onClickCart={() => setCardOpened(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                isLoading={isLoading}
              />
            }
            exact
          />
          <Route path="/favorites" element={<Favorites />} exact />
          <Route path="/orders" element={<Orders />} exact />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
