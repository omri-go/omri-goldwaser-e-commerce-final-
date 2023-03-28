import { useAppContext } from "../context/AppContext";
import ListUsers from "./ListUsers";

const ProfilePage = () => {    
    const { users } = useAppContext(); 

    return (
        <div>
            <br></br>
            <h1>Profile Page</h1>
            <br></br>
            <ListUsers users={users} />
        </div>
    );
};
export default ProfilePage;
