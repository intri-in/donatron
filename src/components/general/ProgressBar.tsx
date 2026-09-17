// import {Next13ProgressBar} from 'next13-progressbar';
import NextTopLoader from 'nextjs-toploader';

const ProgressBar = ({colour}: {colour?: string}) => {

    const barColour = colour? colour : "red"
    // return <Next13ProgressBar color="yellow"  height={5} options={{ showSpinner: true }} />;
        return  <NextTopLoader  showSpinner= {false} height={3}  color={barColour}/>

};

export default ProgressBar;