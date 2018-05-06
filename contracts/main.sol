pragma solidity ^0.4.23;
import '../contracts/mortal.sol';

contract Main is Mortal {
    mapping (bytes32 => string) public fiddle_data;
    event NewFiddle(bytes32 indexed _id);

    // share some given input
    function share(string _code) public {
        bytes32 _id = keccak256(msg.sender, _code);
        fiddle_data[_id] = _code;
        emit NewFiddle(_id);
    }
    // get code for given bytes32 id
    function get_fiddle(bytes32 _id) view public returns (string) {
        return fiddle_data[_id];
    }
}
