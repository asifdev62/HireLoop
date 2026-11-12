import React from 'react';

const JobDetailsPage = ({params}: {params: {id: string}}) => {
    const {id} = params;
    console.log('id', id)
    return (
        <div>
            <h2>Job Details Page</h2>
        </div>
    );
};

export default JobDetailsPage;