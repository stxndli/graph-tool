import {Alg} from './Icons'
const SideBar = (props)=>{
    return (
    <div className="d-flex flex-column flex-shrink-0 bg-light" style={{width: "4.5rem", position:"fixed",zIndex:"99", marginTop:"1em"}}>
        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
          {props.items}
        </ul>
        <div className="dropdown border-top">
          <a href="#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none " data-bs-toggle="dropdown" title="Algorithms">
          <label className={"btn btn-outline-success"}><Alg/></label>  
          </a>
          <ul className="dropdown-menu text-small shadow">
            {props.dropdownitems}
          </ul>
        </div>
  </div>
    )
}
export default SideBar