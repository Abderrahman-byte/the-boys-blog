import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ManageCategoriesPage } from './ManageCategories.page'
import { ManageStaff } from './ManageStaff.page'

export const AdminPages = ({match}) => {
    
    return (
        <Switch>
            <Route exact path={`${match.path}/categories`} component={ManageCategoriesPage} />
            <Route exact path={`${match.path}/staff`} component={ManageStaff} />

            <Route>
                <div>This page doesnt exist please make a dicent 404 page</div>
            </Route>
        </Switch>
    )
}