import React from "react";
import Info from "../Card/info";
import axios from 'axios'
import { useCart } from '../../hooks/useCart';
import styles from './Draver.module.scss'

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000))

function Drawer({ onClose, onRemove, items = [], opened }) {

    const { cartItems, setCartItems, totalPrice } = useCart()
    const [orderId, setorderId] = React.useState(null)
    const [isOrderComplite, setIsOrderComplite] = React.useState(false)
    const [isLoading, setisLoading] = React.useState(false)

    const onClickOrder = async () => {
        try {
            setisLoading(true)
            const { data } = await axios.post('https://649303e2428c3d2035d1234a.mockapi.io/orders', { items: cartItems })
            setorderId(data.id)
            setIsOrderComplite(true)
            setCartItems([])

            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                await axios.delete(`https://6492cc45428c3d2035d0b48c.mockapi.io/cart/${item.id}`)
                await delay()
            }

        } catch {
            alert('Ошибка при создании заказа :(')
        }
        setisLoading(false)
    }

    return (
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
            <div className={styles.drawer}>
                <h2 className="d-flex justify-between mb-30">Корзина<img className="cu-p" src="img/btn-remove.svg" alt="Close" onClick={onClose} /></h2>
                {
                    items.length > 0 ?
                        (
                            <div className="d-flex flex-column flex">
                                <div className="items flex">
                                    {items.map((obj) => (
                                        <div className="cartItem d-flex align-center mb-20" key={obj.id}>
                                            <div
                                                style={{ backgroundImage: `url(${obj.imageUrl})` }}
                                                className="cartItemImg"></div>
                                            <div className="mr-20 flex">
                                                <p className="mb-5">{obj.title}</p>
                                                <b>{obj.price} руб.</b>
                                            </div>
                                            <img onClick={() => onRemove(obj.id)} className="removeBtn" src="img/btn-remove.svg" alt="Remove" />
                                        </div>
                                    ))}
                                </div>
                                <div className="cartTotalBlock">
                                    <ul>
                                        <li>
                                            <span>Итого:</span>
                                            <div></div>
                                            <b>{totalPrice} руб.</b>
                                        </li>
                                        <li>
                                            <span>Налог 5%:</span>
                                            <div></div>
                                            <b>{totalPrice / 100 * 5} руб.</b>
                                        </li>
                                    </ul>
                                    <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ<img src="img/arrow.svg" alt="Arrow" /></button>
                                </div>
                            </div>
                        ) :
                        (
                            <Info
                                title={isOrderComplite ? 'Заказ оформлен' : 'Корзина пустая'}
                                description={isOrderComplite ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` : 'Добавьте хотя бы одну пару кросовок, чтобы сделать заказ.'}
                                image={isOrderComplite ? 'img/complete-order.jpg' : 'img/empty-cart.jpg'}
                            />
                        )}
            </div>
        </div>
    )
}

export default Drawer;
