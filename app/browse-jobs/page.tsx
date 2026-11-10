import React from 'react';

const BrowseJobsPage = async ({searchParams}: {searchParams: Promise<{[key: string]: string | string[] | undefined}>}) => {
    const search = await searchParams;
    console.log("search params:", search)
    return (
        <div>
            <h1>Browse Jobs </h1>
        </div>
    );
};

export default BrowseJobsPage;