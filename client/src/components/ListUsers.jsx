import { Table } from "reactstrap";
import NewUserModal from "./NewUserModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import { useAppContext } from "../context/AppContext";


const ListUsers = ({ users }) => {
    const { loggedUserData, isAuthenticated } = useAppContext();  

    return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Document</th>
          <th>Phone</th>
          <th>Registration</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {!users || users.length <= 0 ? (
          <tr>
            <td colSpan="6" align="center">
              <b>No user available, Try creating new one</b>
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.document}</td>
              <td>{user.phone}</td>
              <td>{user.registrationDate}</td>
              <td align="center">
                <NewUserModal user={user} />
                &nbsp;&nbsp;
                <ConfirmRemovalModal userId={user.id} userName={user.name} is_product={false}/>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </Table>



  );
};
export default ListUsers;
