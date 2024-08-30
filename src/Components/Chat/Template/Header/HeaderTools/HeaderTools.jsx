import React from "react";
import { IoReload } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { FiDelete } from "react-icons/fi";
export const HeaderTools = ({agent}) =>{

    return (
        <div className="acc-header-tools">
                {agent && <IoReload />}
                <CiEdit />
                <FiDelete />
        </div>
    );

}