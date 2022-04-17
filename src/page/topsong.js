import React from 'react';
import $ from 'jquery'
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import {
    useHistory
  } from "react-router-dom";

  const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }));

const TopSong = ({Fet,setLoad, Load, onplay}) => {
    const classes = useStyles();
    const History = useHistory()
    const [ Art, setArt ] = React.useState('Unknown Artist')
    const [ Arr, setArr ] = React.useState([])
    const [ okthen, setOK ] = React.useState(false)
    const [ Artsitcover, setArtData ] = React.useState(null)
    React.useEffect(() => {
        if (onplay == false) {
            History.push('/')
        }
        setLoad(true)
        var url = new URL(window.location.href);
        var c = url.searchParams.get("art");
        if (c!= null) {
            setArt(c)
            $.ajax({
                url: Fet + "/radio/checktopsongartist?artist=" + c,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function () {
                    setLoad(false)
                },
                success: function (r) {
                  setArr(r)
                  setLoad(false)
                }
            })
            $.ajax({
                url: Fet + "/radio/getartist?artist=" + c,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function () {
                    setLoad(false)
                },
                success: function (r) {
                    if (r.name != "") {
                        setArtData(r)
                        setArt(r.name)
                    }
                  setLoad(false)
                }
            })
            setOK(true)
        }
    }, [])
    return ( 
        <div className='mt-3 ml-2 mr-2'>
             <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="arttop" src={Artsitcover != null ?Artsitcover.url : ''} className={classes.large} />
        </ListItemAvatar>
        <ListItemText
        className='mt-4 ml-4'
          primary={"Top song of " + Art}
          secondary={(<a className='cur' onClick={() => History.goBack()}>Go back to Song Info</a>)}
        />
      </ListItem>
        <hr />
        <Grow in={okthen == true ? true : false}>
        {Arr.length > 0 ?  (
            <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Ranking</th>
                    <th scope="col">Song Name</th>
                    <th scope="col">Liked Count</th>
                    </tr>
                </thead>
                <tbody>
                    {Arr.map((item,i) => (
                         <tr>
                         <th scope="row">{i+1}</th>
                         <td>{item.title}</td>
                         <td>{item.countliked}</td>
                         </tr>
                    ))}
                </tbody>
            </table>
            </div>
        ):(
            <div className='text-center pb-2'>
                <h6>No records</h6>
            </div>
        )}
        </Grow>
        </div>
     );
}
 
export default TopSong;