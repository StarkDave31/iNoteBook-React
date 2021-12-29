import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext';



const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;

    return (
        <div className='col-md-3'>
        <div className="card my-3">
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                <h5><span className="badge bg-secondary rounded-pill bg-info">{note.tag}</span></h5>
                <i className="fas fa-trash-alt mx-1" onClick={() => {deleteNote(note._id); props.showAlert("Note deleted successfully","info")}}></i>
                <i className="fas fa-edit mx-1" onClick={() => { updateNote(note)}}></i>
            </div>
        </div>
        </div>
    )
}

export default Noteitem
