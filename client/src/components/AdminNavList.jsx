import React from 'react';
import { Link } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, List } from '@mui/material'
import { Home, People, PersonAdd, School, Assignment, AssignmentTurnedIn, ExpandLess, ExpandMore, DashboardCustomize, Assessment, Map, LibraryBooks, Add } from '@mui/icons-material';

function AdminNavList() {
    const [usersOpen, setUsersOpen] = React.useState(false);
    const [modulesOpen, setModulesOpen] = React.useState(false);
    const [competenciesOpen, setCompetenciesOpen] = React.useState(false);
    const [coursesOpen, setCoursesOpen] = React.useState(false);

    const handleClickUsers = () => {
        setUsersOpen(!usersOpen);
    };

    const handleClickModules = () => {
        setModulesOpen(!modulesOpen);
    };

    const handleClickCompetencies = () => {
        setCompetenciesOpen(!competenciesOpen);
    };

    const handleClickCourses = () => {
        setCoursesOpen(!coursesOpen);
    };

    return (
        <>
            <ListItem key={"Home"} disablePadding>
                <ListItemButton component={Link} to="/admin/home">
                    <ListItemIcon><Home /></ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </ListItemButton>
            </ListItem>
            
            <ListItem key={"Users"} disablePadding>
                <ListItemButton onClick={handleClickUsers}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary={"Users"} />
                    {usersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewUsers"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary={"View Users"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateUser"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users/create">
                            <ListItemIcon><PersonAdd /></ListItemIcon>
                            <ListItemText primary={"Create User"} />
                        </ListItemButton>
                    </ListItem>
                    {/* Bulk create user */}
                    {/* <ListItem key={"CreateUser"} disablePadding>
                        <ListItemButton component={Link} to="/admin/users/bulk-create">
                            <ListItemIcon><FileCopyIcon /></ListItemIcon>
                            <ListItemText primary={"Bulk-create User"} />
                        </ListItemButton>
                    </ListItem> */}
                </List>
            </Collapse>
            
            <ListItem key={"Modules"} disablePadding>
                <ListItemButton onClick={handleClickModules}>
                    <ListItemIcon><School /></ListItemIcon>
                    <ListItemText primary={"Modules"} />
                    {modulesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={modulesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewModules"} disablePadding>
                        <ListItemButton component={Link} to="/admin/modules">
                            <ListItemIcon><Assignment /></ListItemIcon>
                            <ListItemText primary={"View Modules"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateModule"} disablePadding>
                        <ListItemButton component={Link} to="/admin/modules/create">
                            <ListItemIcon><AssignmentTurnedIn /></ListItemIcon>
                            <ListItemText primary={"Create Module"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>

            <ListItem key={"Competencies"} disablePadding>
                <ListItemButton onClick={handleClickCompetencies}>
                    <ListItemIcon><DashboardCustomize /></ListItemIcon>
                    <ListItemText primary={"Competencies"} />
                    {competenciesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={competenciesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewCompetencies"} disablePadding>
                        <ListItemButton component={Link} to="/admin/competencies">
                            <ListItemIcon><Assessment /></ListItemIcon>
                            <ListItemText primary={"View Competencies"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateCompetency"} disablePadding>
                        <ListItemButton component={Link} to="/admin/competencies/create">
                            <ListItemIcon><AssignmentTurnedIn /></ListItemIcon>
                            <ListItemText primary={"Create Competency"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateCompetencyMap"} disablePadding>
                        <ListItemButton component={Link} to="/admin/competencies/create-map">
                            <ListItemIcon><Map /></ListItemIcon>
                            <ListItemText primary={"Create Competency Map"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>

            <ListItem key={"Courses"} disablePadding>
                <ListItemButton onClick={handleClickCourses}>
                    <ListItemIcon><LibraryBooks /></ListItemIcon>
                    <ListItemText primary={"Courses"} />
                    {coursesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={coursesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem key={"ViewCourses"} disablePadding>
                        <ListItemButton component={Link} to="/admin/courses">
                            <ListItemIcon><LibraryBooks /></ListItemIcon>
                            <ListItemText primary={"View Courses"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"CreateCourse"} disablePadding>
                        <ListItemButton component={Link} to="/admin/courses/create">
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary={"Create Course"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}

export default AdminNavList;
