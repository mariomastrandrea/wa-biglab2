import React, { useState, useContext } from 'react';

const UserContext = React.createContext();
const UpdateUserContext = React.createContext();

function useUser() {
   return useContext(UserContext);
}

function useUpdateUser() {
   return useContext(UpdateUserContext);
}

function UserProvider({children}) {
   const [user, setUser] = useState();

   return (
      <UserContext.Provider value={user}>
         <UpdateUserContext.Provider value={setUser}>
            {children}   
         </UpdateUserContext.Provider>
      </UserContext.Provider>
   );
}

export { UserProvider, useUser, useUpdateUser };