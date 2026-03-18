import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat16 "mo:core/Nat16";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Cell = {
    owner : Text;
    color : Text;
  };

  type Player = {
    username : Text;
    color : Text;
    score : Nat;
  };

  module Player {
    public func compare(p1 : Player, p2 : Player) : Order.Order {
      switch (Nat.compare(p1.score, p2.score)) {
        case (#equal) { Text.compare(p1.username, p2.username) };
        case (order) { order };
      };
    };
  };

  type Position = {
    x : Nat16;
    y : Nat16;
  };

  module Position {
    public func compare(p1 : Position, p2 : Position) : Order.Order {
      switch (Nat16.compare(p1.x, p2.x)) {
        case (#equal) { Nat16.compare(p1.y, p2.y) };
        case (order) { order };
      };
    };
  };

  type GameState = {
    owner : Text;
    color : Text;
    position : ?Position;
  };

  module GameState {
    public func compare(gs1 : GameState, gs2 : GameState) : Order.Order {
      Text.compare(gs1.owner, gs2.owner);
    };
  };

  let gameState = Map.empty<Position, GameState>();

  public type Direction = {
    #north;
    #east;
    #south;
    #west;
  };

  public type Move = {
    from : Position;
    to : Position;
    direction : Direction;
  };

  public shared ({ caller }) func createMove(from : Position, direction : Direction) : async Move {
    let to = getNewPosition(from, direction);
    { from; to; direction };
  };

  func getNewPosition(pos : Position, dir : Direction) : Position {
    switch (dir) {
      case (#north) { { x = pos.x; y = pos.y - 1 : Nat16 } };
      case (#east) { { x = pos.x + 1 : Nat16; y = pos.y } };
      case (#south) { { x = pos.x; y = pos.y + 1 : Nat16 } };
      case (#west) { { x = pos.x - 1 : Nat16; y = pos.y } };
    };
  };

  func getValidMovesForPosition(position : Position) : Iter.Iter<(Position, Position)> {
    let positionsToDirections : [(Position, Direction)] = [
      (
        { x = position.x; y = position.y - 1 : Nat16 },
        #north,
      ),
      (
        { x = position.x + 1 : Nat16; y = position.y },
        #east,
      ),
      (
        { x = position.x; y = position.y + 1 : Nat16 },
        #south,
      ),
      (
        { x = position.x - 1 : Nat16; y = position.y },
        #west,
      ),
    ];

    positionsToDirections.values().filter(
      func((targetPosition, _)) {
        targetPosition.x >= 1 and targetPosition.x < 20 and targetPosition.y >= 1 and targetPosition.y < 20;
      }
    ).map(
      func((targetPosition, _)) {
        (position, targetPosition);
      }
    );
  };

  public query ({ caller }) func getAllValidMoves() : async [(Position, Position)] {
    let results = gameState.keys().map(func(position) { getValidMovesForPosition(position) }).flatten();
    results.toArray();
  };
};
