import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function Sidebar() {

  const navigate = useNavigate();

  return (
    <div className="list-group list-group-flush border-end border-3 ">
        <h3 className="list-group-item list-group-item-action list-group-item-light p-3">Filter</h3>
        <p onClick={()=> navigate('/upload')} className="list-group-item list-group-item-action list-group-item-light border-bottom border-3 ">Create</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3 ">Sculptures</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3">Paintings</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3">Virtual</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3">Modern</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3 ">Lanscapes</p>
        <p className="list-group-item list-group-item-action list-group-item-light border-bottom border-3">Events</p>
    </div>

  )
}