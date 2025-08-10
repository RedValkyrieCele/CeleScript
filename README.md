# CeleScript: Shelter Selector  
(or Sniffer or Searcher idk I just want it to be CSSS lol)  

Create a button that brings up a dialog to allow users to \[Add Entry] and select \[Highlight Color].  
Entries display as a row and are comprised of:  
\[Species],  
\[Natures],   
\[Genders],  
\[Level],  
\[Types],  
\[Donor],  
\[Region],  
\[Forme]  

\[Species]: Type a Pokemon species to be matched. Case-insensitive, partial matching allowed.  
- [ ] TODO: Change the Species input to a dropdown with autocomplete, to include Forme. (➝ from Dex manager from api.pokedex() cached earlier)

\[Natures]: Button that opens a second dialog. Second dialog allows user to select by Flavour (Preferred) or exact Natures. Multiple/all are allowed. Options are all canonical Pokemon Natures. Checkboxes are provided. Matches to any of checked options.  
<pre><code>Behaviour: 
        Manually check Sweet ➝ Automatically checks Timid, Hasty, Jolly, Naive.  
                Checked: Sweet, Timid, Hasty, Jolly, Naive.  
                Unchecked: None.  
        Manually uncheck Hasty ➝ Automatically uncheck Sweet. Keep Timid, Jolly, Naive checked.  
                Checked: Timid, Jolly, Naive.  
                Unchecked: Sweet, Hasty.  
        Manually re-check Hasty ➝ Automatically re-check Sweet. Timid, Jolly, Naive still checked.  
                Checked: Sweet, Timid, Hasty, Jolly, Naive.  
                Unchecked: None.  
        Manually uncheck Sweet ➝ Automatically uncheck Timid, Hasty, Jolly, Naive.  
                Checked: None.  
                Checked: Sweet, Timid, Hasty, Jolly, Naive.</code></pre>

\[Genders]: Button that opens a second dialog. Second dialog allows user to select multiple/all Genders. Options are Male, Female, Neutral / Genderless. Checkboxes are provided. Matches to any of checked options.  

\[Level]: Text entry box that permits a numeric value 1-100 (inclusive). Exact match only.  
- [ ] TODO: Change to two numeric up/downs and implement min/max range matching.

\[Types]: Dropdown that permits selection of one of the 18 canonical Pokemon Types. Two dropdowns are provided. Order of Types between the dropdowns are not required to match target Pokemon/Species as long as one or both are present. Exact match only. Dropdown containing unselected Type is ignored.  

