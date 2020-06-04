pragma solidity 0.6.8;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational; // Blocks all state changes throughout the contract if false
    uint8 public airlinesCounter;

    struct Airline {
        string name;
        bool isRegistered;
        bool isFunded;
        uint8 votes;
    }

    mapping(address => Airline) public airlines;
    mapping(address => uint8) private authorizedCaller;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event AirlineRegistered(address airline, string name);
    event AirlineStatusInfo(
        string name,
        bool isRegistered,
        bool isFunded,
        uint256 votes
    );
    event AirlineFunded();
    event FallbackFunctionCalled();
    event ValueReceived(address wallet, uint256 value);
    event AddressIsAuthorized(address wallet);

    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor() public {
        contractOwner = msg.sender;
        operational = true;
        authorizedCaller[msg.sender] = 1;

        // airlines[msg.sender] = Airline({
        //     name: "JHG_Multimedia",
        //     isRegistered: true,
        //     isFunded: false,
        //     votes: 0
        // });
        // airlinesCounter = 1;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
     * @dev Modifier that requires the "operational" boolean variable to be "true"
     *      This is used on all state changing functions to pause the contract in
     *      the event there is an issue that needs to be fixed
     */
    modifier requireIsOperational() {
        require(operational, "Contract is currently not operational");
        _; // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
     * @dev Modifier that requires the "ContractOwner" account to be the function caller
     */
    modifier requireContractOwner() {
        require(contractOwner == msg.sender, "Caller is not contract owner");
        _;
    }

    /**
     * @dev Modifier that requires add airlines is called only from Authorized Contract
     */
    modifier requireIsCallerAuthorized() {
        require(authorizedCaller[msg.sender] == 1, "Caller is not valid");
        _;
    }

    /**
     * @dev Modifier that requires airline to register is not previously registered
     */
    modifier requireAirlineIsNotRegistered(address airline) {
        require(!airlines[airline].isRegistered, "Airline is registered");
        _;
    }

    modifier requireAirlineExists(address airline) {
        require(airlines[airline].isRegistered, "Airline is not registered");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
     * @dev Get operating status of contract
     *
     * @return A bool that is the current operating status
     */

    function isOperational() public view returns (bool) {
        return operational;
    }

    function getContractOwner() external view returns (address) {
        return contractOwner;
    }

    function setContractOwner(address newOwner) external {
        contractOwner = newOwner;
        this.authorizeCaller(newOwner);
    }

    /**
     * @dev Sets contract operations on/off
     *
     * When operational mode is disabled, all write transactions except for this one will fail
     */

    function setOperatingStatus(bool mode) external requireContractOwner {
        operational = mode;
    }

    function authorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        authorizedCaller[contractAddress] = 1;
    }

    function deauthorizeCaller(address contractAddress)
        external
        requireContractOwner
    {
        authorizedCaller[contractAddress] = 0;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     *
     */

    function isAuthorized(address airline) external view returns (bool) {
        return authorizedCaller[airline] == 1;
    }

    function isBeingAuthorized(address airline) public view returns (bool) {
        return authorizedCaller[airline] == 1;
    }

    function registerAirline(address airline, string calldata name)
        external
        requireIsCallerAuthorized
        requireAirlineIsNotRegistered(airline)
        returns (bool success, uint256 votes)
    {
        airlines[airline] = Airline({
            name: name,
            isRegistered: true,
            isFunded: false,
            votes: 0
        });
        airlinesCounter++;
        // this.authorizeCaller(airline);
        emit AirlineRegistered(airline, name);
        return (true, 0);
    }

    function getAirlinesCounter() external view returns (uint8) {
        return airlinesCounter;
    }

    function getAirlineStatus(address airline)
        external
        view
        requireAirlineExists(airline)
        returns (
            string memory,
            bool,
            bool,
            uint8
        )
    {
        string memory name = airlines[airline].name;
        bool isRegistered = airlines[airline].isRegistered;
        bool isFunded = airlines[airline].isFunded;
        uint8 votes = airlines[airline].votes;
        return (name, isRegistered, isFunded, votes);
    }

    function isAirline(address airline) external view returns (bool) {
        return airlines[airline].isRegistered;
    }

    /**
     * @dev Buy insurance for a flight
     *
     */

    // function buy() external payable {}

    /**
     *  @dev Credits payouts to insurees
     */
    // function creditInsurees() external pure {}

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    // function pay() external pure {}

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */

    function fund() public payable {
        require(msg.value >= 10 ether, "Funds are not enought");
        emit AirlineFunded();
    }

    function getFlightKey(
        address airline,
        string memory flight,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // /**
    //  * @dev Fallback function for funding smart contract.
    //  *
    //  */
    // fallback() external payable {
    //     fund();
    // }

    // receive() external payable {
    //     emit ValueReceived(msg.sender, msg.value);
    // }
}
