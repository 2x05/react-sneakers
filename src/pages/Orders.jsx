import React from 'react'
import Card from '../components/Card/Card'
import axios from 'axios'

function Orders() {
    const [orders, setOrders] = React.useState([])
    const [isLoading, setisLoading] = React.useState(true)

    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('https://649303e2428c3d2035d1234a.mockapi.io/orders')
                setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []))
                setisLoading(false)
            } catch {
                alert('Ошибка при запросе заказов')
            }
        })()
    }, [])

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои Заказы</h1>
            </div>
            <div className="d-flex flex-wrap">
                {
                    (isLoading ? [...Array(12)] : orders).map((item, index) => (
                        <Card
                            key={index}
                            loading={isLoading}
                            {...item}
                        />
                    ))}
            </div>

        </div>
    )
}

export default Orders;
