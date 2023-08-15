import ConstructionComponent from './ConstructionComponent';
import TargetGeographyComponent from './TargetGeographyComponent';
import ArtistsComponent from './ArtistsComponent';
import SongsComponent from './SongsComponent';
import EraYearComponent from './EraYearComponent';
import OutputTableComponent from './OutputTableComponent';
import SectionDetailsComponent from './SectionDetailsComponent';
import SongBreakdownTable from './SongBreakdownTable';

const CreateComponent = () => {
    return (
        <div>
            <ConstructionComponent />
            <TargetGeographyComponent />
            <ArtistsComponent />
            <SongsComponent />
            <EraYearComponent />
            <OutputTableComponent />
            <SongBreakdownTable />
            <SectionDetailsComponent />
            {/* Other sections will go here */}
        </div>
    );
}

export default CreateComponent;
