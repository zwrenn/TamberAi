import ArtistsComponent from './ArtistsComponent';
import SongsComponent from './SongsComponent';
import InfluencerComponent from './InfluencerComponent';
import SectionDetailsComponent from './SectionDetailsComponent';

const CreateComponent = () => {
    return (
        <div>
            <ArtistsComponent />
            <SongsComponent />
            <InfluencerComponent />
            <SectionDetailsComponent />
            {/* Other sections will go here */}
        </div>
    );
}

export default CreateComponent;
