    import * as React from 'react';  
    import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';  

    import { DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';  

    export class DropdownSelect extends React.Component {
    constructor(props) { 
        super(props); 

        this.state = { 
        value: null, 
        selectedItem: null, 

        firstDayOfWeek: DayOfWeek.Monday 
        }; 
    } 

    _onDropdownChanged(event) { 
            var newValue = event.key; 
            this.setState( { selectedItem: newValue} ); 
            console.log(newValue); 
    } 

    render() { 
        let { selectedItem } = this.state; 
        let { firstDayOfWeek, value } = this.state; 

        return ( 
        <div className='dropdownExample'>  

            <Dropdown 
            label='Select the first day of the week' 
            defaultSelectedKey={ DayOfWeek[firstDayOfWeek] } 
            options={ [ { text: 'Monday',     key: DayOfWeek[DayOfWeek.Monday] },  
                        { text: 'Tuesday',    key: DayOfWeek[DayOfWeek.Tuesday] },  
                        { text: 'Wednesday',  key: DayOfWeek[DayOfWeek.Wednesday] },  
                        { text: 'Thursday',   key: DayOfWeek[DayOfWeek.Thursday] },  
                        { text: 'Friday',     key: DayOfWeek[DayOfWeek.Friday] },  
                        { text: 'Saturday',   key: DayOfWeek[DayOfWeek.Saturday] },  
                        { text: 'Sunday',     key: DayOfWeek[DayOfWeek.Sunday] }  
                        ] 
            } 
            onChanged={ this._onDropdownChanged.bind(this) } 
            /> 
        );
    }
};
export default DropdownSelect;
