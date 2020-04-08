import assert from 'assert';
import {getAddStarChanges, getRemoveStarChanges, getMoveStarChanges} from "./generateChanges";
import {getById} from "../helpers";

const USER_ID = 'user_id';
const sampleStars = [
  {
    _id: 'root_notes',
    data: 'Notes',
    parentId: USER_ID,
    prev: null,
    next: 'root_trash',
    userId: USER_ID
  }, // Notes under main root
  {
    _id: 'note_child1',
    data: 'note child1 data',
    parentId: 'root_notes',
    prev: null,
    next: 'note_child2'
  },
  {
    _id: 'note_child2',
    data: 'note child2 data',
    parentId: 'root_notes',
    prev: 'note_child1',
    next: 'note_child3',
  },
  {
    _id: 'note_child3',
    data: 'note child3 data',
    parentId: 'root_notes',
    prev: 'note_child2',
    next: null
  },// Trashed nodes:
  {
    _id: 'root_trash',
    data: 'Trash',
    parentId: USER_ID,
    prev: 'root_notes',
    next: 'root_created',
    userId: USER_ID
  },
  {
    _id: 'trash_child1',
    data: 'trash child data',
    parentId: 'root_trash',
    prev: null,
    next: null,
  },
  {
    _id: 'root_created',
    data: 'user made top level',
    parentId: USER_ID,
    prev: 'root_trash',
    next: null,
    userId: USER_ID
  },// User made
];
const sampleStarById = getById(sampleStars);


describe('Test removeStar', () => {
  it("should successfully remove the first node to trash", () => {
    const changes = getRemoveStarChanges(sampleStars, 'note_child1');

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: null,
      next: 'trash_child1',
      parentId: 'root_trash',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
    });
  });

  it("should successfully delete a node already in trash", () => {
    const changes = getRemoveStarChanges(sampleStars, 'trash_child1');

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['trash_child1'];
    expect(changes['trash_child1']['operation']).toEqual('delete');
    expect(changes['trash_child1']['current']).toEqual(originalNoteChild1);
    expect('changed' in changes['trash_child1']).toEqual(false);
  });
});

describe('Test addStar', () => {

  const retrieveGeneratedId = (changes) => {
    const newIds = Object.keys(changes).filter(key => key.includes('new_node_placeholder'));
    expect(newIds).toHaveLength(1);
    return newIds[0];
  };

  it("should addStar to the top of the section", () => {
    const changes = getAddStarChanges(sampleStars, 'new_star_data', 'root_notes', null, true);

    const newStarId = retrieveGeneratedId(changes);

    // Target created node: no original copy + links created
    expect(changes[newStarId]['current']).toBeNull();
    expect(changes[newStarId]['operation']).toBe('add');
    expect(changes[newStarId]['changed']).toEqual({
      prev: null,
      next:  'note_child1',
      parentId: 'root_notes',
      data: 'new_star_data'
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: newStarId,
    });
  })

  it("should addStar to the middle of the section", () => {
    const changes = getAddStarChanges(sampleStars, 'new_star_data', 'root_notes', 'note_child2', 'note_child3');

    const newStarId = retrieveGeneratedId(changes);

    // Target created node: no original copy + links created
    expect(changes[newStarId]['current']).toBeNull();
    expect(changes[newStarId]['operation']).toBe('add');
    expect(changes[newStarId]['changed']).toEqual({
      prev: 'note_child2',
      next:  'note_child3',
      parentId: 'root_notes',
      data: 'new_star_data'
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      next: newStarId,
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild3 = sampleStarById['note_child3'];
    expect(changes['note_child3']['current']).toEqual(originalNoteChild3);
    expect(changes['note_child3']['changed']).toEqual({
      prev: newStarId,
    });
  })
});


describe('Test moveStar', () => {
  it("should move to be new parent's first child when prevId not specified", () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child1', 'root_trash', null, true);

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: null,
      next: 'trash_child1',
      parentId: 'root_trash',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
    });

    // Unaffected neighbor: no changes should be recorded
    expect('note_child3' in changes).toBe(false);

    // Check new neighbor: original copy and link updates changes are recorded
    const originalTrashChild1 = sampleStarById['trash_child1'];
    expect(changes['trash_child1']['current']).toEqual(originalTrashChild1);
    expect(changes['trash_child1']['changed']).toEqual({
      prev: 'note_child1'
    });
  })

  it("should move to be new parent's last child when nextId not specified", () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child1', 'root_trash', true, null);

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: 'trash_child1',
      next:  null,
      parentId: 'root_trash',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
    });

    // Unaffected neighbor: no changes should be recorded
    expect('note_child3' in changes).toBe(false);

    // Check new neighbor: original copy and link updates changes are recorded
    const originalTrashChild1 = sampleStarById['trash_child1'];
    expect(changes['trash_child1']['current']).toEqual(originalTrashChild1);
    expect(changes['trash_child1']['changed']).toEqual({
      next: 'note_child1'
    });
  })

  it('should update links correctly when provided with prevId', () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child1', 'root_notes', 'note_child3', null);

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: 'note_child3',
      next:  null,
      parentId: 'root_notes',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
    });

    const originalNoteChild3 = sampleStarById['note_child3'];
    expect(changes['note_child3']['current']).toEqual(originalNoteChild3);
    expect(changes['note_child3']['changed']).toEqual({
      next: 'note_child1',
    });
  })

  it('should update links correctly when moving first child to be last', () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child1', 'root_notes', 'note_child3', null);

    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: 'note_child3',
      next:  null,
      parentId: 'root_notes',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
    });

    const originalNoteChild3 = sampleStarById['note_child3'];
    expect(changes['note_child3']['current']).toEqual(originalNoteChild3);
    expect(changes['note_child3']['changed']).toEqual({
      next: 'note_child1',
    });
  })

  it('should update links correctly when performing a one hop move', () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child1', 'root_notes', 'note_child2', 'note_child3');
    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      prev: 'note_child2',
      next:  'note_child3',
      parentId: 'root_notes',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
      next: 'note_child1'
    });

    const originalNoteChild3 = sampleStarById['note_child3'];
    expect(changes['note_child3']['current']).toEqual(originalNoteChild3);
    expect(changes['note_child3']['changed']).toEqual({
      prev: 'note_child1',
    });
  })

  it('should be able to move note to an empty section with no neighbors', () => {
    const changes = getMoveStarChanges(sampleStars, 'note_child2', 'root_created', null, null);
    // Target move node: original copy and parent + link updates changes are recorded
    const originalNoteChild2 = sampleStarById['note_child2'];
    expect(changes['note_child2']['current']).toEqual(originalNoteChild2);
    expect(changes['note_child2']['changed']).toEqual({
      prev: null,
      next: null,
      parentId: 'root_created',
    });

    // Affected neighbor: original copy and link updates changes are recorded
    const originalNoteChild1 = sampleStarById['note_child1'];
    expect(changes['note_child1']['current']).toEqual(originalNoteChild1);
    expect(changes['note_child1']['changed']).toEqual({
      next: 'note_child3'
    });

    const originalNoteChild3 = sampleStarById['note_child3'];
    expect(changes['note_child3']['current']).toEqual(originalNoteChild3);
    expect(changes['note_child3']['changed']).toEqual({
      prev: 'note_child1',
    });
  })
});

