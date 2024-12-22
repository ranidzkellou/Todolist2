import MaincontentCateories from "../components/MaincontentCateories";
import Notification from '../components/Message';
import DashMin from '../components/DashMin';

function Dashboard () {

  return (

    <>
            <div className="
            flex gap-3 self-start flex-row h-full w-full grow-0 mt-3 overflow-hidden">
                <MaincontentCateories />
                <div className="h-max w-[20%] space-y-3">
                        <DashMin />
                        <Notification />          
                    </div>
            </div>

    </>

  );
};

export default Dashboard;
