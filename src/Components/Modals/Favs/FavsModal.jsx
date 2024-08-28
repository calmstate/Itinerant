import React from "react";
import { Modal } from "../../Modal/Modal";
import { PiListStarLight } from "react-icons/pi";

export const FavsModal = ({onClose}) =>{

 
    const buttons = [
        {
            name: "Save",
            onClick: ()=>alert('In development')
        },
        {
            name: "Cancel",
            onClick: ()=>onClose()
        }
    ];

    return  <Modal
                icon={<PiListStarLight/>}
                title="Favorites"
                subTitle="Favorite agents"
                onClose={onClose}
                buttons = {buttons}
            ></Modal>

};