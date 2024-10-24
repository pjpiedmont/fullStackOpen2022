const Person = ({ id, name, number, deleteHandler }) => {
	return (
        <div>
            {name} {number} <button onClick={() => deleteHandler(id, name)}>delete</button>
        </div>
    );
}

export default Person