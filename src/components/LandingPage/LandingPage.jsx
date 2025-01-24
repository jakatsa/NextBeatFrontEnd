import React from 'react'
import { AllBeatsPage } from '../AllBeatsPage/AllBeatsPage'
import { CategoryList } from '../CategoryList/CategoryList'
import { AddBeat } from '../Pages/AddBeat'


export const LandingPage = () => {
  return (
    <div>LandingPage
        <CategoryList/>
        <AllBeatsPage/>
        <AddBeat/> {/***functionality not completed */}
        
        
    </div>
  )
}
