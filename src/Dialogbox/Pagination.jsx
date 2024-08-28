import React from 'react';
import { GrPrevious, GrNext } from "react-icons/gr";
const Pagination = ({ totalpost, postperpage, currentpage, setcurrentpage }) => {
    const totalpages = Math.ceil(totalpost / postperpage);
    let pages = [];

    let startpage, endpage;

    if (totalpages <= 3) {
        startpage = 1;
        endpage = totalpages;

    } else {
        if (currentpage <= 2) {
            startpage = 1;
            endpage = 3;
        } else if (currentpage + 1 >= totalpages) {
            startpage = totalpages - 2;
            endpage = totalpages;
        } else {
            startpage = currentpage - 1;
            endpage = currentpage + 1;
        }
    }

    for (let i = startpage; i <= endpage; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">

            <GrPrevious
                onClick={() => setcurrentpage(currentpage > 1 ? currentpage - 1 : currentpage)}
                disabled={currentpage === 1}
            />


            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setcurrentpage(page)}
                    className={currentpage === page ? 'page-link-active' : 'pagination-link'}
                >
                    {page}
                </button>
            ))}


            <GrNext
                onClick={() => setcurrentpage(currentpage < totalpages ? currentpage + 1 : currentpage)}
                disabled={currentpage === totalpages}
            />


        </div>
    );
};

export default Pagination;
