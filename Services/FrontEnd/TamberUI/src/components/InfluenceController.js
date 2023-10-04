<Col md={3}>
    <Form.Group controlId="song">
        <Form.Label>Select a Song to Influence:</Form.Label>
        <Form.Control as="select" value={selectedSong} onChange={e => setSelectedSong(e.target.value)}>
            <option value={null}>None</option>
            {songs.map(song => (
                <option key={song.id} value={song.id}>
                    {song.name}
                </option>
            ))}
        </Form.Control>
    </Form.Group>
</Col>

<Col md={3}>
    <Form.Group controlId="influence">
        <Form.Label>Influence Level: {influenceValue}%</Form.Label>
        <Form.Control 
            type="range" 
            min="0" 
            max="100" 
            value={influenceValue}
            onChange={e => setInfluenceValue(e.target.value)}
        />
    </Form.Group>
</Col>

