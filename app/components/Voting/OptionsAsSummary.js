import { isNonEmptyArray } from "@/app/lib/basicutils"
import { getClasses } from "@/app/lib/styles"

const OptionsAsSummary = ({ organiser, options }) =>
    !isNonEmptyArray(options) ?
        <p align="center">Could not find anything...</p> :
        <div className="main-summary-voting-grid">
            {options.map(e =>
                <div className={getClasses(organiser, "summary-voting-box")} key={e.id}>
                    <div style={{ padding: "1px", gridColumn: "1 / 2" }}>{e.description}</div>
                    <div style={{ gridColumn: "2 / 3", textAlign: "right", whiteSpace: "nowrap", alignSelf: "center" }}>
                        {"Total: " + e.votes}</div>
                </div>)}
        </div>

export default OptionsAsSummary
