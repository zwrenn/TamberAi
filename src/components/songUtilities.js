// songUtilities.js

export async function getSongAttributes(songId) {
    // Fetch the song's attributes from your database or API using the songId
    // Return the attributes as an object
    try {
        const response = await fetch(`/api/songs/${songId}`); // Adjust the URL as needed
        if (!response.ok) {
            throw new Error('Failed to fetch song attributes');
        }
        const songAttributes = await response.json();
        return songAttributes;
    } catch (error) {
        console.error(error);
        return null;
    }
}
  
export function adjustResultsWithInfluence(data, songAttributes, influenceValue) {
    // Create a deep copy of the data to avoid modifying the original array
    const adjustedData = JSON.parse(JSON.stringify(data));
  
    // Find the row corresponding to keys in the adjustedData array
    const keysRow = adjustedData.find(element => element.type === 'key');
    if (!keysRow) {
        return adjustedData; // No keys found, return the original data
    }
  
    // Get the text representation of the selected song's key
    const songKeyText = songAttributes.keysignature.keyname; // Assuming the song's key is available in songAttributes
  
    // Find the entry for the selected song's key in the keysRow
    const songKeyEntry = keysRow.find(entry => entry.name === songKeyText);
    if (songKeyEntry) {
        // Increase the frequency based on influence
        songKeyEntry.frequency += Math.round(songKeyEntry.frequency * (influenceValue / 100));
    }
  
    return adjustedData;
}
