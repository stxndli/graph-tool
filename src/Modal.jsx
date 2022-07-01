import {Modal, Button} from 'react-bootstrap'
const EdgeModal = (props)=>{
    return (
        <div>
        <Modal show={props.show} onHide={props.hide}>
            <Modal.Header closeButton>
                <Modal.Title>New Edge</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="weight">
                <input type="number" className="form-control" placeholder="Weight (leave empty for no weight)" onChange={props.handleWeight} autoFocus/>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={props.directed}>Directed</Button>
                <Button variant="primary" onClick={props.undirected}>Not directed</Button>
            </Modal.Footer>
        </Modal>
    </div>
    )
}
export default EdgeModal