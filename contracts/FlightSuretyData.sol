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
        bool inSystem;
        bool isRegistered;
        bool isFunded;
        uint8 votes;
    }

    mapping(address => Airline) public airlines;
    mapping(address => uint8) private authorizedCaller;

    enum InsuranceState {Active, Payed, Expired}

    struct Insurance {
        address passenger;
        address airline;
        string flight;
        uint256 value;
        InsuranceState state;
    }

    mapping(bytes32 => Insurance) private insurances;

    struct Passenger {
        uint256 credit;
        bool isRegistered;
        uint8 insurances;
    }

    mapping(address => Passenger) private passengers;

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
    event InsurancePurchased(address passenger, address airline, string flight);
    event CreditPayout(address passenger, address airline, string flight);
    event CreditTransfered(address passenger, uint256 value);

    /**
     * @dev Constructor
     *      The deploying account becomes contractOwner
     */
    constructor() public {
        contractOwner = msg.sender;
        operational = true;
        authorizedCaller[msg.sender] = 1;
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
        require(airlines[airline].inSystem, "Airline was not found");
        _;
    }

    modifier requireAirlineIsRegistered(address airline) {
        require(airlines[airline].isRegistered, "Airline is not registered");
        _;
    }

    modifier requireAirlineIsFunded(address airline) {
        require(airlines[airline].isFunded, "Airline is not funded");
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

    function isFunded(address airline) external view returns (bool) {
        return airlines[airline].isFunded;
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
        requireIsOperational
        requireIsCallerAuthorized
        requireAirlineIsNotRegistered(airline)
        returns (bool success, uint256 votes)
    {
        airlines[airline] = Airline({
            name: name,
            inSystem: true,
            isRegistered: airlinesCounter < 4,
            isFunded: false,
            votes: 0
        });
        airlinesCounter++;
        emit AirlineRegistered(airline, name);
        return (true, 0);
    }

    function getAirlinesCounter()
        external
        view
        requireIsOperational
        requireIsCallerAuthorized
        returns (uint8)
    {
        return airlinesCounter;
    }

    function getAirlineStatus(address airline)
        external
        view
        requireIsOperational
        requireIsCallerAuthorized
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

    function isAirline(address airline)
        external
        view
        requireIsOperational
        requireAirlineExists(airline)
        returns (bool)
    {
        return true;
    }

    function voteAirline(address voter, address voted)
        external
        requireIsOperational
        requireAirlineIsRegistered(voter)
        requireAirlineIsNotRegistered(voted)
        returns (uint8, bool)
    {
        uint8 votes = airlines[voted].votes + 1;
        airlines[voted].votes = votes;

        if (votes > (airlinesCounter / 2)) {
            airlines[voted].isRegistered = true;
        }
        return (airlines[voted].votes, airlines[voted].isRegistered);
    }

    /**
     * @dev Buy insurance for a flight
     *
     */

    function buy(
        address passenger,
        address airline,
        string calldata flight
    )
        external
        payable
        requireIsOperational
        requireAirlineIsFunded(airline)
        returns (bool)
    {
        require(msg.value > 0, "Funds are invalid");
        require(msg.value <= 1 ether, "Funds exceed the maximun");
        bytes32 key = keccak256(abi.encodePacked(passenger, airline, flight));
        insurances[key] = Insurance({
            passenger: passenger,
            airline: airline,
            flight: flight,
            value: msg.value,
            state: InsuranceState.Active
        });

        if (passengers[passenger].isRegistered) {
            uint8 ins = passengers[passenger].insurances;
            passengers[passenger].insurances = ins + 1;
        } else {
            passengers[passenger] = Passenger({
                isRegistered: true,
                credit: 0,
                insurances: 1
            });
        }

        emit InsurancePurchased(passenger, airline, flight);
        return true;
    }

    function getPassenger(address passenger)
        external
        view
        requireIsOperational
        requireIsCallerAuthorized
        returns (uint256, uint8)
    {
        require(
            passengers[passenger].isRegistered,
            "Passenger is not registered"
        );
        uint256 credit = passengers[passenger].credit;
        uint8 insurances = passengers[passenger].insurances;

        return (credit, insurances);
    }

    function getInsurance(
        address passenger,
        address airline,
        string calldata flight
    )
        external
        view
        requireIsOperational
        requireIsCallerAuthorized
        returns (uint256, string memory)
    {
        bytes32 key = keccak256(abi.encodePacked(passenger, airline, flight));
        string memory state = "";
        if (insurances[key].state == InsuranceState.Active) {
            state = "Active";
        } else if (insurances[key].state == InsuranceState.Payed) {
            state = "Payed";
        } else {
            state = "Expired";
        }
        return (insurances[key].value, state);
    }

    /**
     *  @dev Credits payouts to insurees
     */
    function creditInsurees(
        address passenger,
        address airline,
        string calldata flight
    ) external requireIsOperational requireIsCallerAuthorized {
        bytes32 key = keccak256(abi.encodePacked(passenger, airline, flight));
        insurances[key].state = InsuranceState.Payed;
        uint256 credit = passengers[passenger].credit;
        uint256 creditToAdd = insurances[key].value.mul(15).div(10);
        passengers[passenger].credit = credit.add(creditToAdd);
        passengers[passenger].insurances = passengers[passenger].insurances - 1;
        emit CreditPayout(passenger, airline, flight);
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
     */
    function pay(address payable passenger, uint256 value)
        external
        payable
        requireIsOperational
        requireIsCallerAuthorized
        returns (uint256)
    {
        passenger.transfer(value);
        uint256 credit = passengers[passenger].credit;
        passengers[passenger].credit = credit.sub(value);
        emit CreditTransfered(passenger, value);
        return passengers[passenger].credit;
    }

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     *
     */

    function fund(address airline) public payable returns (bool) {
        require(msg.value >= 10 ether, "Funds are not enought");
        airlines[airline].isFunded = true;
        emit AirlineFunded();
        return airlines[airline].isFunded;
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
    //     fund(airline);
    // }

    // receive() external payable {
    //     emit ValueReceived(msg.sender, msg.value);
    // }
}
