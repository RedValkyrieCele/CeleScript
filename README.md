# CeleScript: Shelter Selector
(or Sniffer or Searcher idk I just want it to be CSSS lol)

Create a button that brings up a dialog to allow users to \[Add Entry] and select \[Highlight Color].
Entries display as a row and are comprised of:
        - \[Species], 
        - \[Natures], 
        - \[Genders],
        - \[Level], 
        - \[Types], 
        - \[Donor], 
        - \[Region], 
        - \[Forme]


\[Species]:     Type a Pokemon species to be matched.
                    - TODO: Change the Species input to a dropdown with autocomplete (e.g. from Dex manager from api.pokedex() cached earlier)
\[Natures]:     Button that opens a second dialog. Second dialog allows user to select by Flavour (Preferred) or exact Natures. Multiple/all are allowed. Options are all canonical Pokemon Natures. 
                Checkboxes are provided. 
                        Intended Behaviour:  Manually check Sweet ➝ Automatically checks Timid, Hasty, Jolly, Naive.
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
                                                                     Checked: Sweet, Timid, Hasty, Jolly, Naive.
\[Genders]:  Button that opens a second dialog. Second dialog allows user to select multiple/all Genders. Options are Male, Female, Neutral / Genderless. Checkboxes are provided.
\[Level]:    Text entry box that permits a numeric value 1-100 (inclusive). Exact match only.
                        - TODO: Change to two numeric up/downs and implement min/max range matching.
\[Types]:    
