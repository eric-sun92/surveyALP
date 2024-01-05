import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (trimmedKeyword) {
      if (trimmedKeyword.startsWith('starbucks') || ("starbucks").startsWith(trimmedKeyword)) {
        history.push('/home/1');
      } else if (trimmedKeyword.startsWith("domino's") || ("domino's").startsWith(trimmedKeyword) 
                || trimmedKeyword.startsWith("dominos") || ("dominos").startsWith(trimmedKeyword)) {
        history.push('/home/0');
      } else if (trimmedKeyword.startsWith('subway') || ("subway").startsWith(trimmedKeyword)) {
        history.push('/home/2');
      } else {
        history.push(`/brand`);
      }
    } else {
      history.push("/brand");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
        autoComplete="off"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
