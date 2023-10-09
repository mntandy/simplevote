import { getUserText } from "../../lib/styles"


const RefreshAndSort = ({organiser,autoRefresh,sort}) => {

    return (
        <div className="center-aligned-flex">
            <label className="center-aligned-flex row">
                <input
                    type="checkbox" checked={autoRefresh.state} onChange={autoRefresh.toggle} />
                {getUserText(organiser, "refreshText")}
            </label>
            <label className="center-aligned-flex row">
                <input type="checkbox" checked={sort.state} onChange={sort.toggle} />
                {getUserText(organiser, "sortText")}
            </label>
        </div>
    )


}


export default RefreshAndSort