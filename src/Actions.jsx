import { Plus, Drag, Trash, Link } from "./Icons";
import SideBar from "./Sidebar";
const help = {
  delete: "Click on a vertex or an edge to delete it",
  edge: "Select two vertices to connect them with an edge",
  vertex: "Click on canvas to create a vertex",
  DFS: "Select a starting vertex to traverse the graph using DFS algorithm",
  BFS: "Select a starting vertex to traverse the graph using BFS algorithm",
  Dijkstra: "Select a starting vertex",
  "Bellman Ford": "Select a starting vertex",
};
const Actions = (props) => {
  let cnt = 0;
  const actions = {
    0: { value: "delete", inner: "Delete", color: "danger", button: <Trash /> },
    1: { value: "edge", inner: "Edge", color: "success", button: <Link /> },
    2: { value: "vertex", inner: "Vertex", color: "success", button: <Plus /> },
    3: { value: "drag", inner: "Move", color: "success", button: <Drag /> },
  };
  const algs = {
    0: {
      value: "DFS",
      inner: "Depth First Search",
      color: "success",
      button: <Plus />,
    },
    1: {
      value: "BFS",
      inner: "Breadth First Search",
      color: "success",
      button: <Plus />,
    },
    2: {
      value: "Dijkstra",
      inner: "Dijkstra algorithm",
      color: "success",
      button: <Plus />,
    },
    3: {
      value: "Bellman Ford",
      inner: "Bellman Ford Algorithm",
      color: "success",
      button: <Plus />,
    },
    4: {
      value: "Eulerian",
      inner: "Eulerian graph",
      color: "success",
      button: <Plus />,
    },
    5: {
      value: "AP",
      inner: "Articulation Points",
      color: "success",
      button: <Plus />,
    },
  };
  const inputs = [];
  const dropdown = [];
  for (let i = 0; i < Object.keys(actions).length; i++) {
    inputs.push(
      <li className="nav-item" key={i}>
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id={actions[i].value}
          autoComplete="off"
          value={actions[i].value}
          onChange={props.onChange}
        />
        <label
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={actions[i].inner}
          className={"btn btn-outline-" + actions[i].color}
          htmlFor={actions[i].value}
        >
          {actions[i].button}
        </label>
      </li>
    );
  }

  for (let i = 0; i < Object.keys(algs).length; i++) {
    dropdown.push(
      <li className="dropdown-item" key={i}>
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id={"buttonradio" + (i + 1).toString()}
          autoComplete="off"
          value={algs[i].value}
          onChange={props.onChange}
        />
        <label
          className={"btn btn-outline-" + algs[i].color}
          style={{ zIndex: "50" }}
          htmlFor={"buttonradio" + (i + 1).toString()}
        >
          {algs[i].inner}
        </label>
      </li>
    );
  }

  return (
    <div>
      <SideBar items={inputs} dropdownitems={dropdown}></SideBar>
    </div>
  );
};
const DropDown = (props) => {
  const algs = props.algs;
  const inputs = [];
  for (let i = 0; i < Object.keys(algs).length; i++) {
    inputs.push();
  }
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {props.title}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {inputs}
      </ul>
    </div>
  );
};
export { Actions, help };
