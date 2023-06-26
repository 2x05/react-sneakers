import React from 'react'
import Card from '../components/Card/Card'
import AppContext from '../context'

function Home({ searchValue, setSearchValue, onChangeSearchInput, isLoading }) {

    const { items, onAddToFavorite, onAddToCart } = React.useContext(AppContext)

    const renderItems = () => {
        const filtredItems = items.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
        return (
            (isLoading ? [...Array(12)] : filtredItems).map((item, index) => (
                <Card
                    key={index}
                    onFavorite={(obj) => onAddToFavorite(obj)}
                    onPlus={(obj) => onAddToCart(obj)}
                    loading={isLoading}
                    {...item}
                />
            ))
        )
    }

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : "Все кросовки"}</h1>
                <div className="search-block d-flex">
                    <img src="react-sneakers/img/search.svg" alt="Search" />
                    {searchValue && (<img onClick={() => setSearchValue('')} className='clear cu-p' src='react-sneakers/img/btn-remove.svg' alt='Clear' />)}
                    <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
                </div>
            </div>
            <div className="d-flex flex-wrap">
                {renderItems()}
            </div>
        </div>
    )
}

export default Home;
