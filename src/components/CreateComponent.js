import ArtistsComponent from './ArtistsComponent';
import SongsComponent from './SongsComponent';
import InfluencerComponent from './InfluencerComponent';
import SectionDetailsComponent from './SectionDetailsComponent';
import SongBreakdownTable from './SongBreakdownTable';

const CreateComponent = () => {
    return (
        <div>
            <ArtistsComponent />
            <SongsComponent />
            <InfluencerComponent />
            <SongBreakdownTable />
            <SectionDetailsComponent />
            {/* Other sections will go here */}
        </div>
    );
}

export default CreateComponent;
