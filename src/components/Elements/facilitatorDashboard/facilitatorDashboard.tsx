import { Box, Button } from '@mui/material';
import * as React from 'react';
import { ButtonLabelTypography, CaptionRegularTypography, CaptionSemiBoldTypography, H1RegularTypography, H1SemiBoldTypography, H6RegularTypography, H6SemiBoldTypography } from '../../CustomizedTypography';
import commonStyles from './../../../style.module.scss';
import {
    EllipsisVerticalIcon, ArrowRightCircleIcon
} from '@heroicons/react/24/outline';
import Avatar from '../Avatar';
function FacilitatorDashboard() {

    const menuList = [
        { label: 'Mobile Experience Team', actions: "VIEW 15 ACTIONS", isSelected: true },
        { label: 'Superannuation Product Team', actions: "VIEW 5 ACTIONS", isSelected: false },
        { label: 'Insurance Team', actions: "VIEW 15 ACTIONS", isSelected: false },
    ]

    const subMenuList = [
        {
            retroName: 'Mobile App Design BACI Session 3',
            retroCode: '54727',
            retroLink: 'http://app.baci.com/54727',
            retroStartDate: '',
            totalActions: '4', isRetroFinished: false, users: [
                { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
                { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
                { name: 'Ankit', avatar: 'Animals-avatar_11avatar' },
                { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
                { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
                { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
                { name: 'Benny', avatar: 'Animals-avatar_28avatar' },
                { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
                { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
            ]
        },

        {
            retroName: 'Mobile App Design BACI Session 2',
            retroCode: '54149',
            retroLink: 'http://app.baci.com/54149',
            retroStartDate: 'April 19, 2023',
            totalActions: '4', isRetroFinished: true, users: [
                { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
                { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
                { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
                { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
                { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
                { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
                { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
            ]
        }
        ,

        {
            retroName: 'Mobile App Design BACI Session 1',
            retroCode: '53122',
            retroLink: 'http://app.baci.com/53122',
            retroStartDate: 'April 19, 2023',
            totalActions: '5', isRetroFinished: true, users: [
                { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
                { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
                { name: 'Ankit', avatar: 'Animals-avatar_11avatar' },
                { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
                { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
                { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
                { name: 'Benny', avatar: 'Animals-avatar_28avatar' },
                { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
                { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
            ]
        }
    ]

    return (<>
        <Box display="flex" flexDirection="column" width="100%" height="100%" padding="10px" sx={{overflowY:'auto',minHeight:'900px!important'}}>
            {/* Toolbar start*/}
            <Box display="flex" flexDirection="row" width="100%" justifyContent="space-between" height="40px" alignItems="center">
                <Box component="span">


                    <H1RegularTypography label='Facilitator Dashboard' />
                </Box>

                <Box component="span">
                    <Button variant="contained" color="primary">
                        JOIN SESSION
                    </Button>
                    {/* <Box component="span" width="20px" /> */}
                    <Button variant="contained" color='error' sx={{ marginLeft: "20px" }}>
                        NEW SESSION
                    </Button>
                </Box>


            </Box>
            {/* Facilitator menu start */}

            <Box display="flex" flexDirection="row" width="100%" mt="10px">

                {menuList.map((menu) => {
                    return <Box width="330px" height={menu.isSelected ? "170px" : "156px"}
                        border="1px solid rgba(250, 250, 250, 1)"
                        boxShadow="6px 10px 20px 4px rgba(21, 154, 221, 0.08)"
                        padding="16px"
                        paddingBottom={menu.isSelected ? "30px" : '16px'}
                        marginRight="24px"
                        display="flex"
                        flexDirection="column" justifyContent="space-between"
                        sx={{ background: menu.isSelected ? "rgba(0, 0, 0, 0.04)" : 'white' }}

                    >
                        <Box component="span" display="flex" justifyContent="space-between">

                            <H6RegularTypography style={{ width: '274px', color: menu.isSelected ? commonStyles.primaryDark : "black" }} label={menu.label} />
                            <EllipsisVerticalIcon width="24px" height="24px" />
                        </Box>
                        <Button sx={{ width: '188px', display: 'flex', flexDirection: 'row', justifyContent: 'left' }} endIcon={<ArrowRightCircleIcon width="18px" />}>
                            <ButtonLabelTypography label={menu.actions} />
                        </Button>
                    </Box>
                })}


            </Box>
            {/* Retro list starts here */}

            <Box width="100%" height="241px" sx={{ background: "rgba(0, 0, 0, 0.04)", padding: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>


                {/* RetroCard Info */}
                {subMenuList.map((subMenu) => {
                    return <Box width="297px" height="185px" borderRadius="10px"
                        sx={{
                            border: "1px solid rgba(227, 227, 227, 1)", background: 'white',
                            padding: '16px 16px 0px 16px', display: 'flex', flexDirection: 'column', gap: '12px', mr: '10px', ml: '10px'
                        }}>
                        <H6SemiBoldTypography label={subMenu.retroName} />
                        <CaptionRegularTypography label={subMenu.isRetroFinished ? subMenu.retroStartDate : "Code : " + subMenu.retroCode} />
                        {subMenu.isRetroFinished ? <>
                            <CaptionSemiBoldTypography label={subMenu.totalActions + " Actions"} style={{ color: commonStyles.PrimaryMain }} />
                           <Box>
                            <CaptionRegularTypography label="Participants "/>
                            {subMenu.users.map((user,index)=>{
                               { return index<4&&
                               <Avatar
                                key={user.name}
                                avatar={user.avatar}
                                css={{
                                  width: '40px',
                                  height: '40px',
                                  marginLeft: '0',
                                  marginRight: '-8px',
                                  border:'0px'
                                }}
                              />  
                              }
                            })}
                              <CaptionRegularTypography style={{marginLeft:'14px'}} label={"+"+(subMenu.users.length+1-4)} />
                            </Box>
                           </>
                            : 
                            <>
                            <CaptionRegularTypography label={"Link : " + subMenu.retroLink} />
                            <Button variant="outlined" sx={{ borderRadius: '24px', fontWeight: '500px' }} color='primary'>
                                <ButtonLabelTypography label="START SESSION" />
                            </Button>
                            </>
                            }
                            
                           

                    </Box>
                })}


            </Box>

{/* Analytics start here */}
<Box height="500px" display="flex" width="100%"
sx={{boxShadow: "10px 10px 40px 20px rgba(21, 154, 221, 0.08)",border: "1px solid rgba(250, 250, 250, 1)",
marginTop:'10px'}}

>   </Box>

        </Box>


    </>);
}

export default FacilitatorDashboard;