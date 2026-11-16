import { getusers } from '@/lib/api/users';
import React from 'react';

const AdminUserspage =async () => {
    const users = await getusers();
    console.log("users", users)
    return (
        <div>
            
        </div>
    );
};

export default AdminUserspage;