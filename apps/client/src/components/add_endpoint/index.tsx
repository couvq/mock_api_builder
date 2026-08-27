
const AddEndpoint = () => {
    return (
        <>
            <form>
                <input type="text" placeholder="Resource name" />
                <input type="text" placeholder="REST Method" />
                <textarea placeholder={JSON.stringify({ firstName: 'faker.person.firstName', lastName: 'faker.person.lastName', email: 'faker.internet.email' })}></textarea>
                <button type="submit">Add Endpoint</button>
            </form>
            <ul>
                <li>GET /users</li>
                <li>POST /users</li>
                <li>GET /users/:id</li>
                <li>PUT /users/:id</li>
                <li>DELETE /users/:id</li>
            </ul>
        </>
    )
}

export default AddEndpoint