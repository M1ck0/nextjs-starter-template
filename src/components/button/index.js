import style from "./button.module.scss"

const Button = ({title, onClick}) => {
  return (
    <button onClick={onClick} className={style.button}>{title}</button>
  )
}

export default Button
