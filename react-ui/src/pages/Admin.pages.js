import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ManageCategoriesPage } from './ManageCategories.page'
import { ManageStaff } from './ManageStaff.page'
import { NotFound } from './NotFound'

export const AdminPages = ({match}) => {
    
    return (
        <Switch>
            <Route exact path={`${match.path}/categories`} component={ManageCategoriesPage} />
            <Route exact path={`${match.path}/staff`} component={ManageStaff} />

            
            <Redirect exact to={`${match.path}/categories`} from={`${match.path}/`} />

            <Route component={NotFound} />
        </Switch>
    )
}