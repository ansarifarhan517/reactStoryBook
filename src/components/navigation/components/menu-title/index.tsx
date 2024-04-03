import './style.scss'

type menuTitleProps = {
  title: string | undefined;
}

const MenuTitle = ({ title = '' }: menuTitleProps) => (
  <div className="menu-title">{title}</div>
)

export default MenuTitle
